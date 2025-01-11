package ch.ldb;

import java.util.Scanner;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class TerminalPlugin implements Plugin<String> {
    private final Observable<String> output = new Observable<>();
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    @Override
    public Observable<String> getOutput() {
        return output; // Emits data entered in the terminal
    }

    @Override
    public void setInput(Observable<String> input) {
        // Subscribe to the input observable and print the data to the terminal
        input.subscribe(data -> {
            System.out.println("Terminal Output: " + data);
        });
    }

    // Start reading input from the terminal and emit it to the output observable
    public void startReadingFromTerminal() {
        executor.submit(() -> {
            Scanner scanner = new Scanner(System.in);
            System.out.println("Type something in the terminal (it will be saved to output.txt):");
            while (true) {
                String input = scanner.nextLine();
                output.emit(input); // Emit the terminal input
            }
        });
    }
}
