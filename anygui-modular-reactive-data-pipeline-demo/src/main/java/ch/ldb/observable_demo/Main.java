package ch.ldb.observable_demo;

import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Main {
    public static void main(String[] args) {
        // File paths
        String inputFilePath = "src\\main\\java\\ch\\ldb\\.input.txt";
        String outputFilePath = "src\\\\main\\\\java\\\\ch\\\\ldb\\\\.output.txt";

        // Create plugins
        FilePlugin filePlugin = new FilePlugin();
        FormatPlugin formatPlugin = new FormatPlugin();

        // Create observables for each data flow direction
        Observable<String> incomingData = new Observable<>();
        Observable<String> outgoingData = new Observable<>();

        // Watch the input file for changes and emit data to the incoming observable
        filePlugin.watchFile(inputFilePath);
        filePlugin.getFileDataStream().subscribe(incomingData::emit);

        // Subscribe to the incoming data observable
        incomingData.subscribe(data -> {
            String transformed = formatPlugin.transformInput(data);
            System.out.println("From input.txt: " + transformed); // Display in terminal
        });

        // Subscribe to the outgoing data observable
        outgoingData.subscribe(data -> {
            String transformed = formatPlugin.transformOutput(data);
            filePlugin.writeFile(outputFilePath, transformed); // Write to output.txt
        });

        // Start a thread to read terminal input and emit data to the outgoing observable
        ExecutorService terminalExecutor = Executors.newSingleThreadExecutor();
        terminalExecutor.submit(() -> {
            Scanner scanner = new Scanner(System.in);
            System.out.println("Type something in the terminal (it will be written to output.txt):");
            while (true) {
                String input = scanner.nextLine();
                outgoingData.emit(input); // Emit terminal input to the outgoing observable
            }
        });
    }
}
