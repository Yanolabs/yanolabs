import json
import os
import httpx
import uuid

from django.utils.text import slugify
from django.shortcuts import redirect, render
from django.urls import reverse
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.http import HttpResponseBadRequest, JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .forms import CVApplicationForm
from django.contrib.admin.views.decorators import staff_member_required
from django.http import FileResponse, Http404

from .models import Partner


def index(request):
    partners = Partner.objects.all()
    return render(request, 'index.html', {'partners': partners})


def service_request(request):
    if request.method == 'POST':
        service = request.POST.get('service')
        method = request.POST.get('method')
        comms = request.POST.get('comms')

        message_body = f"""
        A new service inquiry has been submitted:

        • Service: {service}
        • Preferred Contact Method: {method}
        • Contact Info: {comms}
        """

        try:
            headers = {
                "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                "Content-Type": "application/json",
            }
            payload = {
                "from": settings.DEFAULT_FROM_EMAIL,
                "to": [settings.ADMIN_EMAIL],
                "subject": "New Service Inquiry - YanoLabs",
                "text": message_body,
            }
            httpx.post("https://api.resend.com/emails", headers=headers, json=payload).raise_for_status()
        except httpx.HTTPStatusError as e:
            print("Resend error:", e)

        return redirect('/home/?service_success=true')

    return redirect('/')

@csrf_exempt
def contact_submit(request):
    if request.method == 'POST':
        service = request.POST.get('service2', 'Not provided')
        method = request.POST.get('method2', 'Not provided')
        contact_info = request.POST.get('comms2', 'Not provided')
        description = request.POST.get('moreinfo', 'Not provided')

        html_body = f"""
        <h2>New Contact Form Submission</h2>
        <p><strong>Service:</strong> {service}</p>
        <p><strong>Preferred Contact Method:</strong> {method}</p>
        <p><strong>Contact Info:</strong> {contact_info}</p>
        <p><strong>Project Description:</strong><br>{description}</p>
        """

        try:
            response = httpx.post(
                "https://api.resend.com/emails",
                headers={
                    "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "from": settings.DEFAULT_FROM_EMAIL,
                    "to": [settings.ADMIN_EMAIL],
                    "subject": "New Contact Form Submission",
                    "html": html_body,
                },
            )
            response.raise_for_status()
            return redirect('/home/?contact_success=true')
        except httpx.HTTPStatusError as e:
            return HttpResponse(f"Error: {e}", status=500)

    return redirect('/')


def apply_now(request):
    if request.method == 'POST':
        form = CVApplicationForm(request.POST, request.FILES)
        if form.is_valid():
            full_name = form.cleaned_data['full_name']
            contact = form.cleaned_data['contact']
            cv = form.cleaned_data['cv']

            if not cv.name.endswith('.pdf'):
                return HttpResponseBadRequest("Only PDF files are allowed.")
            if cv.size > 6 * 1024 * 1024:
                return HttpResponseBadRequest("File too large (max 6MB).")

            base, ext = os.path.splitext(cv.name)
            safe_name = slugify(base)
            filename = f"{safe_name}-{uuid.uuid4()}{ext}"

            filepath = default_storage.save(f"cvs/{filename}", ContentFile(cv.read()))

            file_url = request.build_absolute_uri(reverse('view_cv', args=[filename]))

            try:
                response = httpx.post(
                    "https://api.resend.com/emails",
                    headers={
                        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "from": settings.DEFAULT_FROM_EMAIL,
                        "to": [settings.ADMIN_EMAIL],
                        "subject": "New Job Application - YanoJob",
                        "html": f"""
                                <h2>New CV Application</h2>
                                <p><strong>Name:</strong> {full_name}</p>
                                <p><strong>Contact:</strong> {contact}</p>
                                <p><strong>CV:</strong> <a href="{file_url}">Download CV</a></p>
                            """,
                    }
                )
                response.raise_for_status()
            except httpx.RequestError as e:
                return HttpResponseBadRequest("Failed to send email. Try again later.")

            return redirect(reverse('home') + '?success=true')

        return HttpResponseBadRequest("Invalid form data.")

    return redirect(reverse('home'))

@staff_member_required
def view_cv(request, filename):
    file_path = os.path.join(settings.MEDIA_ROOT, 'cvs', filename)
    if os.path.exists(file_path):
        return FileResponse(open(file_path, 'rb'), content_type='application/pdf')
    raise Http404("File not found")
