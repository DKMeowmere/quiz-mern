import { User } from "@backend/types/user"

const email = `herceg.bosna-${crypto.randomUUID()}@mostar.hb`

export const user: Omit<User, "userQuizes" | "_id"> = {
	name: "Herceg Bosna",
	email,
	biography:
		"Chorwacka Republika Herceg-Bośni (chorwacki Hrvatska Republika Herceg-Bosna) - państwo istniejące podczas wojny w Bośni i Hercegowinie.  W lipcu 1991 władzę nad prowincją Herceg-Bośnia przejęły nacjonalistyczne siły chorwackie. 18 listopada 1991 ogłoszono powstanie niezależnego chorwackiego rządu Herceg-Bośni. Stolicą kraju ogłoszono zachodnią część miasta Mostar. 14 września 1992 trybunał konstytucyjny Bośni i Hercegowiny ogłosił nielegalność Herceg-Bośni. 28 sierpnia 1993 oficjalnie ogłoszono powstanie niezależnej od rządu w Sarajewie Chorwackiej Republiki Herceg-Bośni. 20 stycznia 1994 Bośnia i Hercegowina ogłosiła nieważność tej deklaracji. W marcu 1994 w Waszyngtonie doszło do porozumienia między Chorwatami a Bośniakami. Zgodnie z nim Herceg-Bośnię połączono z Bośnią i Hercegowiną w federację Bośniacko-Chorwacką, jedną z 2 jednostek administracyjnych Bośni. Jedynym prezydentem republiki był Mate Boban.",
	password: "password",
}
