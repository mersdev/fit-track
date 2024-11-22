# Build stage
FROM --platform=linux/amd64 golang:1.23.3-alpine AS builder

# Set working directory
WORKDIR /app

# Install required system dependencies
RUN apk add --no-cache gcc musl-dev

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Build the application with explicit GOARCH
RUN GOARCH=amd64 CGO_ENABLED=1 GOOS=linux go build -o main .

# Final stage
FROM --platform=linux/amd64 alpine:latest

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/main .
COPY --from=builder /app/.env .
COPY --from=builder /app/db/migrations ./db/migrations

# Expose port
EXPOSE 3000

# Run the application
CMD ["./main"]