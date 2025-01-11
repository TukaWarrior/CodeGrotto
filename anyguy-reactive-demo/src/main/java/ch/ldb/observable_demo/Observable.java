package ch.ldb.observable_demo;

import java.util.function.Consumer;

public class Observable<T> {
    private Consumer<T> observer;

    // Subscribes to the observable
    public void subscribe(Consumer<T> observer) {
        this.observer = observer;
    }

    // Emits data to the observer
    public void emit(T data) {
        if (observer != null) {
            observer.accept(data);
        }
    }
}
