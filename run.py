from app import create_app
import socket

if __name__ == '__main__':
    # print(socket.gethostbyname(socket.gethostname()))    
    # app.run()
    app = create_app()
    # app.run(host='192.168.0.14', port=59000, ssl_context='adhoc')
    # app.run(host='192.168.0.20', port=59000, ssl_context=('cert.pem', 'key.pem'))
    # app.run()
    # app.run(host='192.168.0.14', port=59000)
    # app.run(host='10.4.5.250', port=59000)
    # app.run(host=stdout, port=59000)
    # app.run(ssl_context=('cert.pem', 'key.pem'))
    app.run(host='192.168.0.20', port=59000)
    # app.run(host='192.168.202.161', port=59000)
    