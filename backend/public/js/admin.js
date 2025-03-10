$(document).ready(function() {
    // Toggle Sidebar
    $('#sidebarCollapse').on('click', function() {
        $('#sidebar').toggleClass('active');
    });

    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        $('.alert').alert('close');
    }, 5000);

    // Confirm Delete
    $('.delete-confirm').on('click', function(e) {
        if (!confirm('Bạn có chắc chắn muốn xóa?')) {
            e.preventDefault();
        }
    });

    // Image Preview
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

    // Price Format
    $('.price-input').on('input', function() {
        let value = $(this).val().replace(/\D/g, '');
        value = new Intl.NumberFormat('vi-VN').format(value);
        $(this).val(value);
    });

    // DataTable Initialization (if using DataTables)
    if ($.fn.DataTable) {
        $('.datatable').DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/1.10.24/i18n/Vietnamese.json'
            }
        });
    }

    // Form Validation
    $('form').on('submit', function(e) {
        const requiredFields = $(this).find('[required]');
        let isValid = true;

        requiredFields.each(function() {
            if (!$(this).val()) {
                isValid = false;
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        });

        if (!isValid) {
            e.preventDefault();
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
        }
    });

    // Reset Form
    $('.btn-reset').on('click', function() {
        const form = $(this).closest('form');
        form[0].reset();
        form.find('.is-invalid').removeClass('is-invalid');
        $('#imagePreview').attr('src', '');
    });
}); 