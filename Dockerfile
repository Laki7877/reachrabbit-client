# Build myapp server Docker container
FROM httpd:2.4
COPY ./app /usr/local/apache2/htdocs/
RUN sed -i "s#https://bella.reachrabbit.com:8080#https://app.reachrabbit.com:8080#g" /usr/local/apache2/htdocs/js/service.js