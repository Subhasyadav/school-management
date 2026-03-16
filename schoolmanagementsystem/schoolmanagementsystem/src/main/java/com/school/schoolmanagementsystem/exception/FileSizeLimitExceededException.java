//package com.school.schoolmanagementsystem.exception;
//
//public class FileTypeLimitExceededException {
//}

package com.school.schoolmanagementsystem.exception;

public class FileSizeLimitExceededException extends RuntimeException {
    public FileSizeLimitExceededException(String message) {
        super(message);
    }
}
