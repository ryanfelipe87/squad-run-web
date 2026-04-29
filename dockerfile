FROM nginx:alpine

# Remove config padrão
RUN rm -rf /etc/nginx/conf.d/*

# Copia config customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia build do Angular
COPY dist/squadrun_web/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
