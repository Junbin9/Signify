FROM python:3.11-slim


RUN apt-get update && apt-get install -y --no-install-recommends \
    libopencv-dev \
    libx11-6 \
    libxext6 \
    libxrender1 \
    mesa-utils && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /server


COPY . /server


RUN pip install --no-cache-dir --upgrade -r /server/requirements.txt


EXPOSE 8000


CMD ["fastapi", "run", "main.py", "--port", "8000"]