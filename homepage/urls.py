from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name="index"),
    path('home/', views.index, name="home"),
    path('apply-now/', views.apply_now, name='apply_now'),
    path('view-cv/<path:filename>/', views.view_cv, name='view_cv'),
    path('submit-contact/', views.contact_submit, name='contact_submit'),
    path('service-request/', views.service_request, name='service_request'),
]