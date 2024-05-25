import 'package:flutter/material.dart';
import 'package:flutter_blue/flutter_blue.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter BLE LED Control',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  FlutterBlue flutterBlue = FlutterBlue.instance;
  BluetoothDevice? device;
  BluetoothCharacteristic? characteristic;

  void scanForDevices() {
    flutterBlue.startScan(timeout: Duration(seconds: 4));

    var subscription = flutterBlue.scanResults.listen((results) {
      for (ScanResult r in results) {
        if (r.device.name == "ESP32_LED_Control") {
          flutterBlue.stopScan();
          connectToDevice(r.device);
          break;
        }
      }
    });
  }

  void connectToDevice(BluetoothDevice d) async {
    await d.connect();
    setState(() {
      device = d;
    });

    discoverServices();
  }

  void discoverServices() async {
    if (device != null) {
      List<BluetoothService> services = await device!.discoverServices();
      services.forEach((service) {
        if (service.uuid.toString() == "4fafc201-1fb5-459e-8fcc-c5c9c331914b") {
          service.characteristics.forEach((c) {
            if (c.uuid.toString() == "beb5483e-36e1-4688-b7f5-ea07361b26a8") {
              setState(() {
                characteristic = c;
              });
            }
          });
        }
      });
    }
  }

  void sendCommand(String command) async {
    if (characteristic != null) {
      await characteristic!.write(command.codeUnits);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('BLE LED Control'),
      ),
      body: Center(
        child: device == null
            ? ElevatedButton(
                onPressed: scanForDevices,
                child: Text("Connect to ESP32"),
              )
            : Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                    onPressed: () => sendCommand("ON"),
                    child: Text("Turn LED ON"),
                  ),
                  ElevatedButton(
                    onPressed: () => sendCommand("OFF"),
                    child: Text("Turn LED OFF"),
                  ),
                ],
              ),
      ),
    );
  }
}
