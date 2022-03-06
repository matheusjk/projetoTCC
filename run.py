from app import create_app


if __name__ == '__main__':
    # app.run()
    app = create_app()
    # app.run(host='192.168.0.14', port=59000, ssl_context='adhoc')
    # app.run(host='192.168.0.14', port=59000, ssl_context=('cert.pem', 'key.pem'))
    # app.run()
    app.run(host='192.168.0.14', port=59000)
    # app.run(ssl_context=('cert.pem', 'key.pem'))
    # app.run(host='192.168.0.14', port=59000)