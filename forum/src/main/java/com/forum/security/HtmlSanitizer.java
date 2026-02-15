package com.forum.security;

import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

public final class HtmlSanitizer {

    private static final Safelist SAFE_LIST = Safelist.relaxed()
            .addTags("span")
            .addAttributes("a", "target", "rel")
            .addAttributes("img", "src", "alt", "title")
            .addProtocols("a", "href", "http", "https")
            .addProtocols("img", "src", "http", "https", "data");

    private HtmlSanitizer() {
    }

    public static String sanitize(String html) {
        if (html == null) return null;
        return Jsoup.clean(html, SAFE_LIST);
    }
}
