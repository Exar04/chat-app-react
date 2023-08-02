FROM golang AS builder

RUN mkdir /server

COPY . /server

WORKDIR /server

RUN go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o main .

FROM scratch 

COPY --from=builder /server/main .

# ENV DB_HOST=docker.for.mac.host.internal
# ENV DB_PORT=5432
# ENV DB_USER=yash
# ENV DB_PASSWORD=yash
# ENV DB_NAME=WebChats

EXPOSE 8088

CMD ["./main"]