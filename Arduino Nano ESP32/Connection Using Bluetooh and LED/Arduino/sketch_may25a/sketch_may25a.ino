#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// Define the service and characteristic UUIDs
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// Define the LED pin
const int ledPin = 2;

// Create a BLE server callback class
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      Serial.println("Client connected");
    };

    void onDisconnect(BLEServer* pServer) {
      Serial.println("Client disconnected");
    }
};

// Create a BLE characteristic callback class
class MyCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      std::string value = pCharacteristic->getValue();
      if (value.length() > 0) {
        Serial.println("Received value: ");
        for (int i = 0; i < value.length(); i++)
          Serial.print(value[i]);

        Serial.println();

        // Control the LED based on the received value
        if (value == "ON") {
          digitalWrite(ledPin, HIGH);
        } else if (value == "OFF") {
          digitalWrite(ledPin, LOW);
        }
      }
    }
};

void setup() {
  Serial.begin(115200);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  // Initialize BLE
  BLEDevice::init("ESP32_LED_Control");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create BLE service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create BLE characteristic
  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  pCharacteristic->setCallbacks(new MyCallbacks());
  pCharacteristic->setValue("Hello World");
  pService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = pServer->getAdvertising();
  pAdvertising->start();
  Serial.println("Waiting for a client connection...");
}

void loop() {
  // Do nothing here, everything is handled by callbacks
}