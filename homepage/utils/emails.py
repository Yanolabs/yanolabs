import requests
from django.conf import settings

def send_resend_email(to_email, subject, body_text):
    url = "https://api.resend.com/emails"
    headers = {
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json",
    }
    data = {
        "from": settings.RESEND_FROM_EMAIL,
        "to": [to_email],
        "subject": subject,
        "text": body_text,
    }

    response = requests.post(url, json=data, headers=headers)
    return response.status_code in [200, 202]
