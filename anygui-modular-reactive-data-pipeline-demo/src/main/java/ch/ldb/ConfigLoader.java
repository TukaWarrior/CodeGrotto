package ch.ldb;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

public class ConfigLoader {
    private final Map<String, String> config = new HashMap<>();

    // Load the configuration from a file
    public ConfigLoader(String filePath) {
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("=");
                if (parts.length == 2) {
                    config.put(parts[0].trim(), parts[1].trim());
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Get a configuration value as a string
    public String get(String key) {
        return config.get(key);
    }

    // Get a configuration value as a resolved path
    public Path getPath(String key) {
        String pathStr = config.get(key);
        if (pathStr == null) {
            throw new IllegalArgumentException("Key not found in config: " + key);
        }
        return Paths.get(pathStr).toAbsolutePath().normalize();
    }

    // Get the interface type
    public String getInterface() {
        return get("interface");
    }

    // Get the format type
    public String getFormat() {
        return get("format");
    }
}
