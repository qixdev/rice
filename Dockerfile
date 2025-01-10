FROM ubuntu:latest
LABEL authors="danial"

ENTRYPOINT ["top", "-b"]