import {body} from 'express-validator'

export const loginValidation = [
    body("email", 'Неверный формат почты').isEmail(),
    body("password", "Пароль должен быть больше 5 символов").isLength({min: 5})
]

export const registerValidation = [
    body("email", 'Неверный формат почты').isEmail(),
    body("password", "Пароль должен быть больше 5 символов").isLength({min: 5}),
    body("fullName", "Имя не может быть короче двух символов").isLength({min: 2}),
    body("avatarUrl", "Неверный формат ссылки на аватарку").optional().isURL()
]

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
    body('tags', 'Неверный формат тэгов').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
  ];