     bảng `users`
    #	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
    1	id Primary	int(11)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
    2	tenKH	varchar(50)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    3	email	varchar(100)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    4	pass	varchar(100)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    5	role	varchar(30)	utf8mb4_general_ci		No	None			Change Change	Drop

    bảng `address`

    #	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
    1	id Primary	int(11)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
    2	userName	varchar(100)	utf8mb4_general_ci		No	None			Change Change	Drop Drop
    3	phoneNumber	int(11)			No	None			Change Change	Drop Drop
    4	userAddress	varchar(255)	utf8mb4_general_ci		No	None			Change Change	Drop Drop



     bảng `products`

# Name Type Collation Attributes Null Default Comments Extra Action

    1	id Primary	int(11)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
    2	title	varchar(200)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    3	urlImg	text	utf8mb4_general_ci		Yes	NULL			Change Change	Drop Drop
    4	priceOld	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    5	priceNew	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    6	quantity	int(11)			No	None			Change Change	Drop Drop
    7	sold	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    8	brand	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    9	nation	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    10	evaluate	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    11	discount	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    12	size	varchar(50)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    13	available	varchar(30)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
    14	iddm	int(11)			Yes	NULL			Change Change	Drop Drop

    bảng `category`

    	#	Name	Type	Collation	Attributes	Null	Default	Comments	Extra	Action
    1	id Primary	int(11)			No	None		AUTO_INCREMENT	Change Change	Drop Drop
    2	loaisanpham	varchar(50)	utf8_general_ci		Yes	NULL			Change Change	Drop Drop
