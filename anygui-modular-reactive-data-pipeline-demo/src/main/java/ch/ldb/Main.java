package ch.ldb;

public class Main {
    public static void main(String[] args) {
        // Load configuration
        String configFilePath = "src\\main\\java\\ch\\ldb\\.config.txt";
        ConfigLoader configLoader = new ConfigLoader(configFilePath);

        // Create the plugin factory
        PluginFactory pluginFactory = new PluginFactory(configLoader);

        // Dynamically create plugins
        Plugin<String> interfacePlugin = pluginFactory.createInterfacePlugin();
        Plugin<String> formatPlugin = pluginFactory.createFormatPlugin();
        TerminalPlugin terminalPlugin = new TerminalPlugin();

        // Wire the plugins together
        formatPlugin.setInput(interfacePlugin.getOutput()); // InterfacePlugin -> FormatPlugin
        terminalPlugin.setInput(formatPlugin.getOutput()); // FormatPlugin -> TerminalPlugin
        interfacePlugin.setInput(terminalPlugin.getOutput()); // TerminalPlugin -> InterfacePlugin

        // Start reading from the terminal
        terminalPlugin.startReadingFromTerminal();
    }
}
