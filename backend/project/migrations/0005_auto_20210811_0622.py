# Generated by Django 3.2.4 on 2021-08-11 06:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0004_feedbackrequest_feedback'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbackrequest',
            name='feedback_Created_Date',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='feedbackrequest',
            name='essay',
            field=models.ForeignKey(help_text='The essay being edited as part of the feedback request. For simplicity, we assume that a feedback request consists of only one essay.', on_delete=django.db.models.deletion.CASCADE, related_name='feedback_request', to='project.essay'),
        ),
    ]
