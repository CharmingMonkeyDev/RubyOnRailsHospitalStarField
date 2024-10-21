if AdtPatientNotification.count.zero?
    # for parsing of this HL7 look https://docs.google.com/document/d/1Zrsl4pvcozxBr45AQBkNJtEvtq_Me0UtyOjLu-SQcfs/edit#
    patient = User.where(role: "patient").first
    a01_payload = "MSH|^~\&|ALT^ALT^L|ALT^ALT^L|ALT^NDHIN^L|ALT^NDHIN^L|20180828072351-0500|1081|ADT^A01^ADT_A01|91458795_35432d17-8305-48cd-994c-0726ace0cea5|P|2.3
    EVN|A01|20180828072351||||20180828072200
    PID|1|11111|#{patient.mrn_number}^^^ALT&ALT||HYRE^KAREN^K||19700101|F||2106-3^White~2106-3^White|11111 Test Lane^PO BOX 11111^RALEIGH^NC^27513-1234^USA^^^GRAND FORK||9198860708^^^^^919^8860708~0000000000^^^^^0^0|||||68178119|222-33-4444|||||||||||N
    NK1|1|WILLIAMS^VICTORIA|SIS^Sister|7003 GRASSY HILLS LANE^^CARY^NC^27518^USA|9193472222^^^^^919^3472222||Emergency Contact 1
    PV1|1|O|AS^^^ALT&Altru Health Systems||||7688^MELAND^BRAD^^^^^^ALT-PV&ALT-PV||7688^MELAND^BRAD^^^^^^ALT-PV&ALT-PV||||||||7688^MELAND^BRAD^^^^^^ALT-PV&ALT-PV&ALT-PV||68178119^^^&ALT|COMM||||||||||||||||||||||||20180828072200||||||20191196
    PV2|||left carpal tunnel syndrome^left carpal tunnel syndrome^L-ALT
    AL1|1|DA|18192^FEXOFENADINE HCL^EXTELG||Sob|20121015
    AL1|2|DA|35^TETRACYCLINES \T\ RELATED^EXTELG||Hives~Swelling~Rash|20100430
    ZDG1|Ignore"

    ProcessInboundAdtNotification.new({file_name: "Test 1",file_content: a01_payload}).call

    a03_payload = "MSH|^~\&|^PAS^OHCP|ASHL^ASHL|RHAPSODY^RHAPSODY|NDHIN^NDHIN|20110921161840-0500||ADT^A03|680-201609254321_37ddcfc6-c3ac-471c-9899-1d3586837|P|2.4|||AL|NE|USA
    EVN||20141030121201
    PID|1||#{patient.mrn_number}^^^ASHL&ASHL^MR||Cardinal^Jono||19491112023046|M|||27 Shirley Rd^Windsor^^^1064^NZL
    PV1||I|ASHL^^^ASHL&Ashley Medical Center CH||||Qx10-123456^Martin^Joe^^^Dr^^^&ASHL-PV||Qx10-123456^Martin^Joe^^^Dr^^^&ASHL-PV|MED||||7|||||E94569-4565.9^^^&ASHL&OHCP|||||||||||20121212|||||20121212|||||||||20110816215822|20080827021200
    PV2|||Sprained ankle^Sprained ankle^L-ASHL
    DG1|1||E10^Type 1 diabetes mellitus^I10||20110102120000|A
    "

    ProcessInboundAdtNotification.new({file_name: "Test 2",file_content: a03_payload}).call

    a03_payload = "MSH|^~\&|HNAM^TRIN|HNAM^TRIN|STAR^NDHIN|STAR^NDHIN|20211006080333-0500||ADT^A03|12345.patient5.1_0debd5a2-33a8-411c-824b-de53f3f77|P|2.3||||||8859/1
    EVN|A03|20211006075600
    PID|1||#{patient.mrn_number}^^^TRIN&TRIN||nbspatient5^5years||20161001|M|||5 nbspatient5 test drive^^BOWBELLS^ND^58721||7025555555
    PV1|1|O|TRIN^^^TRIN&Trinity Hospital^^^BDSJ||||1508931676^WOLSKY^CHAD^J^^^^^TRIN-PV&TRIN-PV||1508931676^WOLSKY^CHAD^J^^^^^TRIN-PV&TRIN-PV||||||||1508931676^WOLSKY^CHAD^J^^^^^TRIN-PV&TRIN-PV|SJ|5555555555^^^TRIN&TRIN|MR||||||||||||||||||||||||20210606060100|20210606075600
    PV2|||NBS Pathways Testing^NBS Pathways Testing^L-TRIN
    ZDG1|Ignore
    "
    ProcessInboundAdtNotification.new({file_name: "Test 3",file_content: a03_payload}).call
    
end 