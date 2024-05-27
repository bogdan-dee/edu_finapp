openssl req \
    -newkey rsa:2048 \
    -x509 \
    -nodes \
    -keyout /{full path to project dir}/.docker/nginx/ssl/finapp.local.key \
    -new \
    -out /{full path to project dir}/.docker/nginx/ssl/finapp.local.crt \
    -reqexts SAN \
    -extensions SAN \
    -config /{full path to project dir}/.docker/nginx/ssl/openssl.conf \
    -sha256 \
    -days 3650

#add cert to dev laptop/desktop
#sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain /{full path to project dir}/.docker/nginx/ssl/finapp.local.crt