from app import app


if __name__ == '__main__':
    app.run(host='192.168.0.13', port=59000, ssl_context='adhoc')
