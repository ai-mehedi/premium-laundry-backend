function HttpRequest(method, url, data) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: method,
            ...(data ? { body: JSON.stringify(data) } : {}),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (response) => {
            const responseJson = await response.json();
            return {
                ...responseJson,
                statusCode: response.status,
            };
        }).then((result) => {
            if ([200, 201].includes(result.statusCode)) {
                resolve(result);
            } else {
                reject(result);
            }
        }).catch(() => {
            reject({
                statusCode: 500,
                message: 'Oops! Something went wrong!',
            });
        });
    });
}
function toggleFormInputValidation(input, isValid, errorText) {
    if (isValid) {
        input.removeAttribute('data-invalid');
        const feedBackElement = input.nextElementSibling;
        if (
            feedBackElement &&
            feedBackElement.classList.contains('invalid-feedback')
        ) {
            feedBackElement.remove();
        }
    } else {
        input.setAttribute('data-invalid', 'true');

        const feedBackElement = input.nextElementSibling;
        if (
            feedBackElement &&
            feedBackElement.classList.contains('invalid-feedback')
        ) {
            feedBackElement.textContent = errorText;
        } else {
            const feedBackElement = document.createElement('div');
            feedBackElement.classList.add('invalid-feedback');
            feedBackElement.classList.add('d-block');
            feedBackElement.textContent = errorText;
            input.insertAdjacentElement('afterend', feedBackElement);
        }
    }
}
function postForm() {
    let all_forms = document.querySelectorAll('form[data-form="true"]');
    all_forms.forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            let url = form.getAttribute('data-url');
            const dataSuccessCallback = form.getAttribute('data-success-callback');

            if (!url) {
                toastr.error('URL not found');
                return;
            }

            let submitButton = form.querySelector('button[type="submit"]');
            if (!submitButton) {
                toastr.error('Submit button not found');
                return;
            }

            const method = form.getAttribute('method') || 'POST';

            submitButton.setAttribute('disabled', 'true');
            submitButton.setAttribute('data-loading', 'true');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = 'Submitting...';

            const formData = new FormData(event.target);
            const body = Object.fromEntries(formData.entries());

            form.querySelectorAll('input[type="checkbox"][name]').forEach((input) => {
                body[input.name] = formData.getAll(input.name);
            });

            try {
                const response = await fetch(url.toString(), {
                    method,
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify(body),
                });
                const result = await response.json();

                if (result?.continue) {
                    if (result?.continue?.redirect) {
                        if ([200, 201].includes(response.status)) {
                            toastr.success(result.message, 'Success!');
                        } else {
                            toastr.error(result.message, 'Error!');
                        }

                        setTimeout(() => {
                            window.location.href = result?.continue?.redirect;
                        }, 1000);
                        return;
                    }
                }

                if (response.ok) {
                    if (dataSuccessCallback) {
                        window[dataSuccessCallback]?.(form, result);
                    } else {
                        submitButton.removeAttribute('disabled');
                        submitButton.removeAttribute('data-loading');
                        submitButton.innerHTML = originalButtonText;

                        toastr.success(result.message, 'Success!');
                    }
                } else {
                    if (result.errors) {
                        let noInput = true;
                        let noInputMessage = null;
                        for (const error of result.errors) {
                            const input = form.querySelector(`[name="${error.field}"]`);
                            noInputMessage = error.message;
                            if (input) {
                                noInput = false;
                                toggleFormInputValidation(input, false, error.message);
                            }
                        }
                        if (noInput) {
                            toastr.error(noInputMessage || result.message);
                        }
                    } else {
                        toastr.error(result.message);
                    }
                    submitButton.removeAttribute('disabled');
                    submitButton.removeAttribute('data-loading');
                    submitButton.innerHTML = originalButtonText;
                }
            } catch (error) {
                console.log(error);
                toastr.error('Oops! Something went wrong!');
            }
        });
    });
}
postForm();
function paginateResult() {
    let all_forms = document.querySelectorAll('form[data-paginate-form="true"]');
    all_forms.forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            var url = form.getAttribute('data-url');
            var page = form.getAttribute('data-page');
            const main_table = form.querySelector('#main_table');
            const table_body = form.querySelector('#table_body');
            const table_loading = form.querySelector('#table_loading');
            const table_notfound = form.querySelector('#table_not_found');
            const total_data = form.querySelector('#total_data');
            const table_pagination_row = form.querySelector(
                '#table_pagination_row',
            );

            main_table.classList.add('d-none');
            table_body.classList.add('d-none');
            table_notfound.classList.add('d-none');
            total_data.classList.add('d-none');
            table_pagination_row.classList.add('d-none');
            table_loading.classList.remove('d-none');

            const formData = new FormData(event.target);
            const jsonObject = {};
            formData.forEach((value, key) => {
                jsonObject[key] = value;
            });
            let current_status = 0;

            // query from formData
            const queryString = new URLSearchParams({
                ...jsonObject,
                page,
            }).toString();

            fetch(`${url}?${queryString}`, {
                method: form.getAttribute('method'),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                current_status = response.status;
                return response.json();
            }).then((rsp) => {
                if ([200, 201].includes(current_status)) {
                    if (rsp.data_exist == true) {
                        main_table.classList.remove('d-none');
                        total_data.classList.remove('d-none');
                        table_body.innerHTML = rsp.data;
                        total_data.textContent = rsp.total_count;
                        table_pagination_row.innerHTML = rsp.pagination;
                        table_pagination_row.classList.remove('d-none');
                        table_body.classList.remove('d-none');
                        table_loading.classList.add('d-none');
                        table_notfound.classList.add('d-none');
                    } else {
                        main_table.classList.add('d-none');
                        table_body.innerHTML = '';
                        table_pagination_row.innerHTML = '';
                        total_data.textContent = 0;
                        table_body.classList.add('d-none');
                        table_loading.classList.add('d-none');
                        table_notfound.classList.remove('d-none');
                    }

                    document.querySelector('#table_pagination_row').innerHTML =
                        rsp.pagination;
                } else {
                    let message = rsp?.message || 'Oops! Something went wrong';
                    if (rsp?.errors) {
                        if (rsp.errors.length > 0) {
                            message = rsp.errors[0].message;
                        }
                    }
                    toastr.error(message, `Error ${current_status}!`);
                }
            })
                .catch(() => {
                    toastr.error('Oops! Something went wrong!', `Error!`);
                });
        });
    });
}
paginateResult();

function removeData(e, url) {
    if (confirm('Are you sure you want to delete this data?')) {
        HttpRequest('DELETE', url).then((response) => {
            toastr.success(response.message, 'Success!');
            e.closest('tr').remove();
        }).catch((error) => {
            console.error(error);
            toastr.error(error.message, 'Error!');
        });
    }
}

async function submitThumbnailUpload(event, e) {
    event.preventDefault();
    const path = e.getAttribute('data-path');
    const input = document.querySelector(e.getAttribute('data-input'));
    const file = event.target.files[0];

    e.querySelector('img').src = '/images/loading.gif';

    if (file) {
        const formData = new FormData();
        formData.append('path', path);
        formData.append('file', event.target.files[0]);

        try {
            const response = await fetch(CDN_UPLOAD_URL, {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();

            if (response.status === 200) {
                input.value = result.payload.fileName;
                let fileUrl = '';
                fileUrl = `${CDN_URL}${result.payload.filePath}/${result.payload.fileName}`;

                e.querySelector('img').src = fileUrl;
            } else {
                input.value = '';
                toastr.error(result.message, 'Error!');
            }
        } catch (err) {
            console.log(err);
            input.value = '';
            toastr.error('Oops! Something went wrong.', 'Error!');
        }
    }
}

function uploadThumbnail(e) {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/png,image/jpeg,image/jpg';
    fileInput.onchange = function (event) {
        let files = event.target.files;
        if (files.length > 0) {
            submitThumbnailUpload(event, e);
        }
    };
    fileInput.click();
}
function uploadHandleFile(blobInfo, progress, path) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('path', path);
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        const options = {
            method: 'POST',
            body: formData,
        };
        fetch(CDN_UPLOAD_URL, options).then((response) => response.json()).then((result) => {
            const file_path = `${CDN_URL}/${path}/${result.payload.fileName}`;
            resolve(file_path);
        }).catch((err) => {
            reject(err);
        });
    });
}
function changeSlug(e) {
    const slug = e.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    document.querySelector('input[name="slug"]').value = slug;
    document.querySelector('input[name="slug"]').dispatchEvent(new Event('input'));
}