from django.contrib import admin
from .models import Partner

admin.site.site_header = "YanoLabs Admin"
admin.site.site_title = "YanoLabs Admin Portal"
admin.site.index_title = "Welcome to YanoLabs admin panel"

admin.site.register(Partner)
