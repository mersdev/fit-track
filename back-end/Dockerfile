# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o ./fitness-backend ./main.go

# Final stage
FROM alpine:latest AS runner
WORKDIR /app
COPY --from=builder /app/fitness-backend .

# Create .env file from build args
ARG SUPABASE_HOST
ARG SUPABASE_USER
ARG SUPABASE_PASSWORD
ARG SUPABASE_DBNAME
ARG SUPABASE_PORT
ARG SUPABASE_ID
ARG SUPABASE_KEY

RUN echo "SUPABASE_HOST=${SUPABASE_HOST}" > .env && \
    echo "SUPABASE_USER=${SUPABASE_USER}" >> .env && \
    echo "SUPABASE_PASSWORD=${SUPABASE_PASSWORD}" >> .env && \
    echo "SUPABASE_DBNAME=${SUPABASE_DBNAME}" >> .env && \
    echo "SUPABASE_PORT=${SUPABASE_PORT}" >> .env && \
    echo "SUPABASE_ID=${SUPABASE_ID}" >> .env && \
    echo "SUPABASE_KEY=${SUPABASE_KEY}" >> .env

EXPOSE 3000
ENTRYPOINT ["./fitness-backend"]