# Generated by Django 3.2.4 on 2021-08-11 05:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0003_install_data'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbackrequest',
            name='feedback',
            field=models.CharField(default='', max_length=500),
        ),
    ]
