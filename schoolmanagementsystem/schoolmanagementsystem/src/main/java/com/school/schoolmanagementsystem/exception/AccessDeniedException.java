//package com.school.schoolmanagementsystem.exception;
//
//public class AccessDeniedException {
//}

package com.school.schoolmanagementsystem.exception;

public class AccessDeniedException extends RuntimeException {
    public AccessDeniedException(String message) {
        super(message);
    }
}
