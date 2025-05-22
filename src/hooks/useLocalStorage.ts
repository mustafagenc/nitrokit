import { useState } from 'react';

/**
 * A custom React hook that provides a state variable that is persisted in the browser's localStorage.
 * It behaves similarly to `useState`, but automatically saves the state to localStorage whenever it changes
 * and initializes the state from localStorage on component mount.
 *
 * @template T The type of the value to be stored in localStorage.
 * @param {string} key The key under which the value will be stored in localStorage.
 * @param {T} initialValue The initial value to use if no value is found in localStorage for the given key.
 * @returns {[T, (value: T | ((prevState: T) => T)) => void]} A tuple containing:
 *          - The current state value (of type `T`).
 *          - A function to update the state value. This function can either take the new value directly
 *            or a callback function that receives the previous state and returns the new state.
 *            The new value will be persisted to localStorage.
 * @example
 * ```tsx
 * const [name, setName] = useLocalStorage<string>('username', 'Guest');
 *
 * // To update the name:
 * setName('John Doe');
 * // or
 * setName(prevName => prevName.toUpperCase());
 * ```
 */
const useLocalStorage = <T>(key: string, initialValue: T) => {
    const [state, setState] = useState(() => {
        try {
            const value = window.localStorage.getItem(key);
            return value ? JSON.parse(value) : initialValue;
        } catch (error) {
            console.log(error);
        }
    });

    const setValue = (value: T | ((prevState: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(state) : value;
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            setState(value);
        } catch (error) {
            console.log(error);
        }
    };

    return [state, setValue];
};

export default useLocalStorage;
