# Generated by Django 3.2.4 on 2021-08-11 06:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0005_auto_20210811_0622'),
    ]

    operations = [
        migrations.AddField(
            model_name='feedbackrequest',
            name='essay_Given_By_Student',
            field=models.CharField(default='Essay...', max_length=500),
        ),
    ]
