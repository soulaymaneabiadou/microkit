include ./Makefile.vars

auth-secrets:
	kubectl create secret generic jwt-secrets \
	--from-literal JWT_SECRET=$(JWT_SECRET) \
	--from-literal JWT_EXPIRE=$(JWT_EXPIRE) \
	--from-literal JWT_COOKIE_EXPIRE=$(JWT_COOKIE_EXPIRE) \

smtp-secrets: 
	kubectl create secret generic smtp-secrets \
	--from-literal SMTP_HOST=$(SMTP_HOST) \
	--from-literal SMTP_PORT=$(SMTP_PORT) \
	--from-literal SMTP_EMAIL=$(SMTP_EMAIL) \
	--from-literal SMTP_PASSWORD=$(SMTP_PASSWORD) \
	--from-literal FROM_EMAIL=$(FROM_EMAIL) \
	--from-literal FROM_NAME=$(FROM_NAME)

stripe-secrets:
	kubectl create secret generic stripe-secrets \
	--from-literal STRIPE_SECRET_KEY=$(STRIPE_SECRET_KEY) \
	--from-literal STRIPE_PUBLIC_KEY=$(STRIPE_PUBLIC_KEY) \
	--from-literal STRIPE_WEBHOOKS_SECRET=$(STRIPE_WEBHOOKS_SECRET)

set-secrets: auth-secrets smtp-secrets

rm-secrets:
	kubectl delete secrets jwt-secrets smtp-secrets

dev:
	skaffold dev
