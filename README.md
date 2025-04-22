# Student_Subject_Score_Manager

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Example Data (SQL)

### Student Table

```sh
INSERT INTO student (student_id, name, birthdate, class_)
VALUES
    (01, 'Nguyen Minh Anh', '2008-05-05', '11 Tin1'),
    (02, 'Tran Gia Bao', '2008-02-21', '11 Tin1'),
    (03, 'Pham Quoc Binh', '2008-07-08', '11 Tin1'),
    (04, 'Ho Tan Minh Dang', '2008-05-07', '11 Tin1'),
    (05, 'Pham Minh Dang', '2008-01-02', '11 Tin1'),
    (06, 'Nguyen Minh Duc', '2008-08-13', '11 Tin1'),
    (07, 'Le Gon', '2008-12-22', '11 Tin1'),
    (08, 'Do Thi Bich Hang', '2008-03-20', '11 Tin1'),
    (09, 'Vo Ke Hoai', '2008-10-09', '11 Tin1'),
    (10, 'Le Nguyen Minh Hoang', '2008-05-31', '11 Tin1'),
    (11, 'Nguyen Doan Quang Huy', '2008-03-31', '11 Tin1'),
    (12, 'Bui Quoc Vinh Khang', '2008-11-10', '11 Tin1'),
    (13, 'Tang Bao Khang', '2008-05-06', '11 Tin1'),
    (14, 'Doan Do Minh Khoa', '2008-06-05', '11 Tin1'),
    (15, 'Khuong Hong Khoi', '2008-11-01', '11 Tin1'),
    (16, 'Nguyen Vo Vuong Kiet', '2008-12-13', '11 Tin1'),
    (17, 'Doan Ngoc Binh Minh', '2008-09-28', '11 Tin1'),
    (18, 'Tu Hoang Nam', '2008-12-05', '11 Tin1'),
    (19, 'Vu Nguyen Khanh Ngoc', '2008-07-07', '11 Tin1'),
    (20, 'Nguyen Khoi Nguyen', '2008-09-10', '11 Tin1'),
    (21, 'Tran An Nguyen', '2008-09-12', '11 Tin1'),
    (22, 'Vo Thanh Nhan', '2008-01-30', '11 Tin1'),
    (23, 'Le Nguyen Hong Nhien', '2008-02-28', '11 Tin1'),
    (24, 'Tran Kieu Oanh', '2008-04-26', '11 Tin1'),
    (25, 'Vo Trinh An Phu', '2008-04-07', '11 Tin1'),
    (26, 'Nguyen Thien Phuong', '2008-08-25', '11 Tin1'),
    (27, 'Nguyen Hoang Phap Quang', '2008-11-24', '11 Tin1'),
    (28, 'Nguyen Hoang Quan', '2008-12-01', '11 Tin1'),
    (29, 'Tran Vu Anh Quan', '2008-03-30', '11 Tin1'),
    (30, 'Truong My Thanh', '2008-04-30', '11 Tin1'),
    (31, 'test', '2008-01-01', '11 Tin 11');
```

### Subject Table

```sh
INSERT INTO subject(subject_id, name, amount)
VALUES
    (1, 'Toan', 4),
    (2, 'Ly', 2),
    (3, 'Hoa', 2),
    (4, 'Sinh', 2),
    (5, 'Van', 4),
    (6, 'Su', 3),
    (7, 'Tin', 8),
    (8, 'The Duc', 2);
```

### Score Table

```sh
INSERT INTO score(score_id, student_id, subject_id, score, date)
VALUES
    (1, 1, 1, 8.5, '2025-04-01'),
    (2, 5, 2, 9.0, '2025-04-02'),
    (3, 6, 3, 7.5, '2025-04-03'),
    (4, 7, 4, 8.0, '2025-04-04'),
    (5, 9, 5, 9.5, '2025-04-05'),
    (6, 10, 6, 8.0, '2025-04-06'),
    (7, 12, 7, 9.0, '2025-04-07'),
    (8, 13, 8, 7.0, '2025-04-08'),
    (9, 14, 1, 8.0, '2025-04-01'),
    (10, 16, 2, 9.3, '2025-04-02'),
    (11, 17, 3, 7.0, '2025-04-03'),
    (12, 20, 4, 8.3, '2025-04-04'),
    (13, 23, 5, 9.8, '2025-04-05'),
    (14, 24, 6, 8.8, '2025-04-06'),
    (15, 25, 7, 9.0,'2025-04-07'),
    (16 ,29,8 ,7.5 ,'2025-04-08');
```
