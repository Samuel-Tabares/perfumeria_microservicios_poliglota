from django.contrib import admin
from .models import Cliente, Compra

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'apellido', 'email', 'telefono', 'fecha_registro', 'activo')
    list_filter = ('activo', 'fecha_registro')
    search_fields = ('nombre', 'apellido', 'email', 'telefono')
    date_hierarchy = 'fecha_registro'
    ordering = ('-fecha_registro',)

@admin.register(Compra)
class CompraAdmin(admin.ModelAdmin):
    list_display = ('id', 'cliente', 'fecha_compra', 'total', 'completada')
    list_filter = ('completada', 'fecha_compra')
    search_fields = ('cliente__nombre', 'cliente__apellido')
    date_hierarchy = 'fecha_compra'
    ordering = ('-fecha_compra',)
    raw_id_fields = ('cliente',)