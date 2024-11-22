# Build stage
FROM golang:1.19-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o ./fitness-backend ./main.go

# Final stage
FROM alpine:latest AS runner
WORKDIR /app
COPY --from=builder /app/fitness-backend .
EXPOSE 3000
ENTRYPOINT ["./fitness-backend"]