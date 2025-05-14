package ch.ldb;

public interface Plugin<T> {
    // Exposes the plugin's output as an observable
    Observable<T> getOutput();

    // Accepts input from another plugin
    void setInput(Observable<T> input);
}
