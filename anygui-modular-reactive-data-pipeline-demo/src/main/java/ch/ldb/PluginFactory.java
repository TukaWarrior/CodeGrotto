package ch.ldb;

import java.nio.file.Path;

public class PluginFactory {
    private final ConfigLoader configLoader;

    public PluginFactory(ConfigLoader configLoader) {
        this.configLoader = configLoader;
    }

    public Plugin<String> createInterfacePlugin() {
        String interfaceType = configLoader.getInterface();
        Path inputPath = configLoader.getPath("inputPath"); // Get resolved input path
        Path outputPath = configLoader.getPath("outputPath"); // Get resolved output path

        if ("1".equals(interfaceType)) {
            FilePlugin1 filePlugin = new FilePlugin1();
            filePlugin.watchFile(inputPath.toString()); // Use resolved input path
            filePlugin.setOutputFilePath(outputPath.toString()); // Use resolved output path
            return filePlugin;
        } else if ("2".equals(interfaceType)) {
            FilePlugin2 filePlugin2 = new FilePlugin2();
            filePlugin2.watchFile(inputPath.toString()); // Use resolved input path
            filePlugin2.setOutputFilePath(outputPath.toString());
            return filePlugin2; // FilePlugin2 doesn't need an output path in this example
        } else {
            throw new IllegalArgumentException("Unknown interface: " + interfaceType);
        }
    }

    public Plugin<String> createFormatPlugin() {
        String formatType = configLoader.getFormat();
        if ("1".equals(formatType)) {
            return new FormatPlugin1();
        } else if ("2".equals(formatType)) {
            return new FormatPlugin2();
        } else {
            throw new IllegalArgumentException("Unknown format: " + formatType);
        }
    }
}
