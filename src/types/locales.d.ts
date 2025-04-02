export type LocalePhrases = 
        "welcome"
    |   "search_groups"
    |   "submit_group"
    |   "login"    
    |   "register"
    |   "step_by_step"
    |   "how_submit_a_group"
    |   "how_submit_hero_section_text"
    |   "how_submit_hero_section_text_details"
    |   "logout"
    ;


export type Locale_t = {
  [key in LocalePhrases]: string;
};
