package com.forum.exception;

/**
 * Clasă centralizată pentru mesajele de eroare personalizate.
 * Toate mesajele sunt în română pentru consistență.
 */
public final class ErrorMessages {

    private ErrorMessages() {
        // Clasă utilitară - nu permite instanțiere
    }

    // ========== AUTENTIFICARE ==========
    public static final String LOGIN_INVALID_CREDENTIALS = "Email sau parolă incorectă. Te rugăm să verifici datele introduse.";
    public static final String LOGIN_USER_NOT_FOUND = "Utilizatorul nu a fost găsit.";
    public static final String AUTHENTICATION_REQUIRED = "Autentificare necesară. Te rugăm să te autentifici.";
    public static final String AUTHENTICATION_FAILED = "Autentificare eșuată. Token invalid sau expirat.";
    public static final String UNAUTHORIZED_ACCESS = "Nu ai permisiunea de a accesa această resursă.";

    // ========== UTILIZATORI ==========
    public static final String USER_NOT_FOUND = "Utilizatorul nu a fost găsit.";
    public static final String USER_NOT_FOUND_BY_ID = "Utilizatorul cu ID-ul %d nu a fost găsit.";
    public static final String USER_NOT_FOUND_BY_EMAIL = "Utilizatorul cu email-ul %s nu a fost găsit.";
    public static final String USER_EMAIL_ALREADY_EXISTS = "Un utilizator cu acest email există deja în sistem.";
    public static final String USER_NICKNAME_ALREADY_EXISTS = "Un utilizator cu acest nickname există deja în sistem.";
    public static final String USER_CANNOT_MODIFY_OTHER = "Nu poți modifica datele altui utilizator.";
    public static final String USER_CANNOT_DELETE_SELF = "Nu poți șterge propriul cont.";
    public static final String USER_INVALID_ID = "ID-ul utilizatorului este invalid.";

    // ========== PAROLĂ ==========
    public static final String PASSWORD_TOO_SHORT = "Parola trebuie să aibă cel puțin 6 caractere.";
    public static final String PASSWORD_REQUIRED = "Parola este obligatorie.";
    public static final String PASSWORD_RESET_TOKEN_INVALID = "Token-ul de resetare a parolei este invalid sau a expirat.";
    public static final String PASSWORD_RESET_TOKEN_REQUIRED = "Token-ul de resetare este obligatoriu.";
    public static final String PASSWORD_RESET_FAILED = "Resetarea parolei a eșuat. Te rugăm să încerci din nou sau să soliciți un link nou.";

    // ========== CATEGORII ==========
    public static final String CATEGORY_NOT_FOUND = "Categoria nu a fost găsită.";
    public static final String CATEGORY_NOT_FOUND_BY_ID = "Categoria cu ID-ul %d nu a fost găsită.";
    public static final String CATEGORY_INVALID_ID = "ID-ul categoriei este invalid.";
    public static final String CATEGORY_NAME_REQUIRED = "Numele categoriei este obligatoriu.";
    public static final String CATEGORY_DELETE_HAS_SUBJECTS = "Nu poți șterge categoria deoarece conține subiecte.";

    // ========== SUBIECTE ==========
    public static final String SUBJECT_NOT_FOUND = "Subiectul nu a fost găsit.";
    public static final String SUBJECT_NOT_FOUND_BY_ID = "Subiectul cu ID-ul %d nu a fost găsit.";
    public static final String SUBJECT_INVALID_ID = "ID-ul subiectului este invalid.";
    public static final String SUBJECT_TITLE_REQUIRED = "Titlul subiectului este obligatoriu.";
    public static final String SUBJECT_TEXT_REQUIRED = "Conținutul subiectului este obligatoriu.";
    public static final String SUBJECT_CATEGORY_REQUIRED = "Categoria subiectului este obligatorie.";
    public static final String SUBJECT_USER_REQUIRED = "Utilizatorul subiectului este obligatoriu.";
    public static final String SUBJECT_CANNOT_MODIFY_OTHER = "Nu poți modifica subiectele altor utilizatori.";

    // ========== MESAJE ==========
    public static final String MESSAGE_NOT_FOUND = "Mesajul nu a fost găsit.";
    public static final String MESSAGE_NOT_FOUND_BY_ID = "Mesajul cu ID-ul %d nu a fost găsit.";
    public static final String MESSAGE_INVALID_ID = "ID-ul mesajului este invalid.";
    public static final String MESSAGE_TEXT_REQUIRED = "Conținutul mesajului este obligatoriu.";
    public static final String MESSAGE_SUBJECT_REQUIRED = "Subiectul mesajului este obligatoriu.";
    public static final String MESSAGE_USER_REQUIRED = "Utilizatorul mesajului este obligatoriu.";
    public static final String MESSAGE_CANNOT_MODIFY_OTHER = "Nu poți modifica mesajele altor utilizatori.";

    // ========== ACHIEVEMENTS ==========
    public static final String ACHIEVEMENT_NOT_FOUND = "Achievement-ul nu a fost găsit.";
    public static final String ACHIEVEMENT_NOT_FOUND_BY_ID = "Achievement-ul cu ID-ul %d nu a fost găsit.";
    public static final String ACHIEVEMENT_INVALID_ID = "ID-ul achievement-ului este invalid.";
    public static final String ACHIEVEMENT_NAME_REQUIRED = "Numele achievement-ului este obligatoriu.";
    public static final String ACHIEVEMENT_TITLE_NOT_UNLOCKED = "Titlul selectat nu este deblocat pentru acest utilizator.";
    public static final String ACHIEVEMENT_ALREADY_UNLOCKED = "Achievement-ul este deja deblocat pentru acest utilizator.";

    // ========== VALIDARE ==========
    public static final String VALIDATION_ERROR = "Datele introduse nu sunt valide.";
    public static final String VALIDATION_EMAIL_INVALID = "Adresa de email nu este validă.";
    public static final String VALIDATION_EMAIL_REQUIRED = "Adresa de email este obligatorie.";
    public static final String VALIDATION_NICKNAME_REQUIRED = "Nickname-ul este obligatoriu.";
    public static final String VALIDATION_NICKNAME_TOO_SHORT = "Nickname-ul trebuie să aibă cel puțin 3 caractere.";
    public static final String VALIDATION_NICKNAME_TOO_LONG = "Nickname-ul nu poate depăși 50 de caractere.";
    public static final String VALIDATION_FIELD_REQUIRED = "Câmpul '%s' este obligatoriu.";
    public static final String VALIDATION_INVALID_FORMAT = "Formatul datelor introduse nu este valid.";

    // ========== ACCES ==========
    public static final String ACCESS_DENIED = "Nu ai permisiunea de a efectua această acțiune.";
    public static final String ACCESS_DENIED_ADMIN_ONLY = "Această acțiune este disponibilă doar pentru administratori.";
    public static final String ACCESS_DENIED_MODIFY_OWN_ONLY = "Poți modifica doar propriile resurse.";
    public static final String ACCESS_DENIED_TITLE_CHANGE = "Poți schimba doar propriul titlu.";
    public static final String ACCESS_DENIED_AVATAR_CHANGE = "Poți schimba doar propriul avatar.";
    public static final String ACCESS_DENIED_QUOTO_CHANGE = "Poți schimba doar propriul citat.";

    // ========== OPERAȚII GENERALE ==========
    public static final String OPERATION_FAILED = "Operația a eșuat. Te rugăm să încerci din nou.";
    public static final String RESOURCE_NOT_FOUND = "Resursa solicitată nu a fost găsită.";
    public static final String INVALID_REQUEST = "Cererea este invalidă. Verifică datele trimise.";
    public static final String INTERNAL_SERVER_ERROR = "A apărut o eroare internă. Te rugăm să încerci mai târziu.";
    public static final String DATABASE_ERROR = "A apărut o eroare la accesarea bazei de date.";

    // ========== EMAIL ==========
    public static final String EMAIL_SEND_FAILED = "Nu s-a putut trimite email-ul. Te rugăm să încerci din nou.";
    public static final String EMAIL_INVALID = "Adresa de email nu este validă.";

    // ========== TOKEN ==========
    public static final String TOKEN_INVALID = "Token-ul este invalid sau a expirat.";
    public static final String TOKEN_EXPIRED = "Token-ul a expirat. Te rugăm să te autentifici din nou.";
    public static final String TOKEN_REQUIRED = "Token-ul este obligatoriu pentru această operație.";

    // ========== UTILITARE ==========
    /**
     * Formatează un mesaj cu parametri
     */
    public static String format(String template, Object... args) {
        return String.format(template, args);
    }
}
