$(document).ready(function () {
    // Toggle Sidebar
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Auto-hide alerts after 5 seconds
    $('.alert').delay(5000).fadeOut(350);

    // Confirm delete actions
    $('.delete-confirm').on('click', function(e) {
        if (!confirm('Bạn có chắc chắn muốn xóa?')) {
            e.preventDefault();
        }
    });

    // Image preview
    $('#productImage').on('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreview').attr('src', e.target.result);
            }
            reader.readAsDataURL(file);
        }
    });

    // Form validation
    $('form').on('submit', function() {
        $(this).find(':input').filter(function() {
            return !this.value;
        }).closest('.form-group').addClass('has-error');
        
        if ($(this).find('.has-error').length) {
            return false;
        }
        return true;
    });

    // Remove error class on input
    $('.form-control').on('input', function() {
        $(this).closest('.form-group').removeClass('has-error');
    });

    // DataTable initialization
    if ($.fn.DataTable) {
        $('.datatable').DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.7/i18n/vi.json'
            }
        });
    }
}); 