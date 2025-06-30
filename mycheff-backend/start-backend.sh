#!/bin/bash
# MyCheff Backend Kalıcı Başlatma Script'i
# Kullanıcının belirttiği password (123) ile database'e bağlanır

echo "🚀 MyCheff Backend Başlatılıyor..."

# Environment değişkenlerini set et
export DATABASE_PASSWORD=123
export DATABASE_HOST=localhost
export DATABASE_PORT=5432
export DATABASE_USERNAME=postgres
export DATABASE_NAME=postgres
export NODE_ENV=development

echo "✅ Environment variables set:"
echo "  DATABASE_PASSWORD: $DATABASE_PASSWORD"
echo "  DATABASE_HOST: $DATABASE_HOST"
echo "  DATABASE_PORT: $DATABASE_PORT"

# Existing processes'leri kill et
echo "🛑 Existing backend processes durduruluyor..."
pkill -f "nest" 2>/dev/null || echo "No existing backend processes"

# Backend'i başlat
echo "🚀 Backend başlatılıyor..."
npm run start:dev

echo "🎉 Backend başlatıldı!" 