/* eslint-disable no-undef */
import Swal from 'sweetalert2'

const Alert = {
    // Success Alert
    success: (title, text = '') => {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        })
    },

    // Error Alert
    error: (title, text = '') => {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonColor: '#d33',
            confirmButtonText: 'OK'
        })
    },

    // Info Alert
    info: (title, text = '') => {
        return Swal.fire({
            icon: 'info',
            title: title,
            text: text,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        })
    },

    // Warning Alert
    warning: (title, text = '') => {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
            confirmButtonColor: '#f8bb86',
            confirmButtonText: 'OK'
        })
    },

    // Confirm Alert (Returns Promise)
    confirm: (title, text = '', confirmText = 'Yes, delete it!', cancelText = 'Cancel') => {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmText,
            cancelButtonText: cancelText
        })
    },

    // Toast Notification
    toast: (title, icon = 'success') => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })

        return Toast.fire({
            icon: icon,
            title: title
        })
    }
}

export default Alert
