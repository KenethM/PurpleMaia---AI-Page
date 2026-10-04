# Dokku deploy for sandbox.purplemaia.org.
#
# There is no build step here and there never has been — the site is plain
# HTML, one CSS file and two JS files, served as-is. So this does not reach
# for a buildpack: it just puts nginx in front of the repo, which is the same
# thing GitHub Pages does.
#
# Dokku auto-detects a Dockerfile and skips herokuish entirely.
FROM nginx:1.27-alpine

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

# Dokku reads EXPOSE to learn the container port, then maps 80/443 to it.
EXPOSE 80
