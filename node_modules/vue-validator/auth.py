from hashlib import md5
import hmac
print ( "?auth=" + hmac.new("vue-validator:659cff54-91d1-49bc-9106-b5e5cd6d3a4f", None, md5).hexdigest())
