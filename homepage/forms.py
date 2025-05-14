from django import forms

class CVApplicationForm(forms.Form):
    full_name = forms.CharField(max_length=280)
    contact = forms.CharField(max_length=280)
    cv = forms.FileField()

    def clean_cv(self):
        file = self.cleaned_data['cv']
        if not file.name.endswith('.pdf'):
            raise forms.ValidationError("Only PDF files are allowed.")
        if file.size > 6 * 1024 * 1024:
            raise forms.ValidationError("CV file must be under 6MB.")
        return file
