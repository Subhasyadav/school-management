//package com.school.schoolmanagementsystem.exception;
//
//public class InvalidFileTypeException {
//}


package com.school.schoolmanagementsystem.exception;

public class InvalidFileTypeException extends RuntimeException {
    public InvalidFileTypeException(String message) {
        super(message);
    }
}