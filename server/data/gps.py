import serial.tools.list_ports
from serial import Serial
from pyubx2 import UBXReader, UBX_PROTOCOL

ports = serial.tools.list_ports.comports()

# check ports
for port, desc, hwid in sorted(ports):
        print("{}: {} [{}]".format(port, desc, hwid))

port = Serial("COM4", baudrate=115200, timeout=30.0)
with port as stream:
      ubr = UBXReader(stream, protfilter=UBX_PROTOCOL)
      raw, parsed = ubr.read()
      for raw, parsed in ubr:
             print(parsed)

# while True:
#     rcv = port.read(10)
#     port.write("\r\nYou sent:" + repr(rcv))

# updateEPH