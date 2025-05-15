from rest_framework import serializers
from .models import Cliente, Compra

class CompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compra
        fields = ['id', 'cliente', 'fecha_compra', 'total', 'completada']

class ClienteSerializer(serializers.ModelSerializer):
    compras = CompraSerializer(many=True, read_only=True)
    
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'apellido', 'email', 'telefono', 'direccion', 
                 'fecha_registro', 'activo', 'compras']
        
class ClienteSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'apellido', 'email', 'activo']