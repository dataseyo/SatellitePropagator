import serial.tools.list_ports
from serial import Serial

ports = serial.tools.list_ports.comports()

# check ports
for port, desc, hwid in sorted(ports):
        print("{}: {} [{}]".format(port, desc, hwid))

port = Serial("COM4", baudrate=115200, timeout=3.0)

while True:
    rcv = port.read(10)
    port.write("\r\nYou sent:" + repr(rcv))

