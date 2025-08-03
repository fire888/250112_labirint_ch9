# Документация проекта

## ОПИСАНИЕ ОБЩЕЕ

* Используются сантиметры.  
* **modules** создаются напрямую в приложении  
* **systems** создаются через конфиги динамическим импортом в зависимости от режима (dev/prod) чтоб не увеличивать бандл

## СЦЕНАРИИ ПОВЕДЕНИЯ

Пользователь меняет сдвиг текстуры

* systems/UserInterface/panels/PanelMaterials слушает сдвиг и апдейтит себя   
* чекает текущий фокус элемента через systems/Selector и кидает событие skinChangeTexture медиатору на апдейт свойств  
* modules/Skin подхватывает событие кидает событие в system/Graphics/Entities   
* system/Graphics/Entities меняет материал при помощи system/Graphics/Materials  
* modules/Skin кидает событие изменения проекта ‘prjChange’ в modules/Project  
* modules/Project фиксирует что проект изменен

Пользователь добавляет декор

* systems/UserInterface вешает на кнопку ДобавитьДекор событие открывающее systems/UserInterface/panels/PanelDecor   
* systems/UserInterface вешает событие на хтмл элемент картинки декора через systems/UserInterface/IntefaceActions событие ‘decorCreate’  
* modules/Decor подхватывает ‘decorCreate’ подгружает модель через modules/Models      
* modules/Models бросает событие ‘tmpLoadGltf’ в Engine/systems/Graphics                                                                       
* modules/Decor/Placement выравнивает модель относительно элемента при помощи modules/Decor/Lair и бросает событие ‘plcDecorAdd’  
* modules/Decor/Placement подхватывает событие и ждет у systems/Selector смены активного 3д меша и кидает событие ‘grRaySetByPlane’ и переходит в режим PLACE  
* Engine/systems/Graphics/Raycast ставит поверхность для размещения элемента  
* modules/Decor/Placement подписанный на событие mouseMove двигает в режиме PLACE меш по квартире  
* modules/Decor/Placement подписанный на событие mouseClick чекает режим PLACE и останавливает перемещение модели  
* modules/Decor/Placement подписанный на событие mouseDown чекает режим NONE и добавляет круг поворота и   
* modules/Decor/Placement подписанный на событие mouseMove двигает в режиме ROTATE вращает меш  
* modules/Decor/Placement подписан на событие ‘mouseUp’ и кидает событие ‘prjСhange’ сохранить проект   
* modules/Project подхватывает событие ‘prjGhange’ и фиксирует изменение

## ОПИСАНИЕ ОСНОВНЫХ ЭЛЕМЕНТОВ

**Remplanner3D** Точка входа

* config \- конфиг приложения   
* создает экземпляры из **modules**: modules/Application, modules/Registry, modules/Project, modules/Mode, modules/Decor, modules/Skin, modules/Entourage, modules/Apartments, modules/Spatium, Engine

**Engine** создается точкой входа Remplanner3D

* создает все **systems** для приложения из конфига Remplanner-cfg (пример: systems/UserInterface). они живут изолированно слушают медиатор   
* создает API для создания мешей

**modules** которые создаются в точке входа Remplanner3D. 

modules/**Application**	создается точкой входа Remplanner3D

* хранит права пользователя  
* слушает ошибки приложения, отсылает на сервер репорты об ошибках    
* создает эффекты постпроцессинга в зависимости от аппаратной поддержки 

.isSandbox \= window\['rplanner\_sandbox'\] флаг не слать алерты на реальный сервер  
   
modules/**Registry** создается точкой входа Remplanner3D

* Реестр данных для моделей для добавления в квартиру пользователя. window.global\_visual\_data \- серверные данные зашитые в страницу с бэка   
* Отдает верстку для systems/UserInterface каталогов элементов 

modules/**Project** создается точкой входа Remplanner3D

* создает класс ProjectSource в котором происходит загрузка и валидация проекта пользователя  
* хранит данные проекта квартиры пользователя

modules/Project/**ProjectSource**   
подгрузка и валидация проекта квартиры пользователя

modules/Project/**OldVersion**  
	конвертация серверных сохраненных данных в формат удобный приложению

modules/**Mode** создается точкой входа Remplanner3D

* текущий режим взаимодействия с пользователем (Обычный вид, Ходьба, Скрытие стен).  
* сохраняет пользовательские ракурсы камер в LocalStorage и подтягивает оттуда 

modules/**Decor** создается точкой входа Remplanner3D   
создает и при помощи Graphics добавляет в сцену меши декора

	modules/Decor/**Placement** \- отвечает за перемещение декора

modules/Decor/**Lair** \- отвечает за поверхности для размещения декора

modules/**Skin** создается точкой входа Remplanner3D  
Из проекта пользователя сигналит в сцену создать материалы  
	options.saveKey \- ключ по которому материал ищется в сохраненном проекте пользователя   
		и сохраняется если не находится и возвращается  
	options.presetId \- если options.saveKey не находит материал то материал берется из    
modules/Skin**/Presets**   
\#create(options) ищет материал в сохраненном проекте пользователя, если находит   
	то берет дефолтный материал из modules/**Registry** и применяет к нему   
	сохраненные настройки, если не находит то берет материал из modules/Skin**/Presets**   
	и сохраняет в проекте кастомные настройки.

modules/**Entourage** создается точкой входа Remplanner3D  
создает студию для рендера

modules/**Spatium** создается точкой входа Remplanner3D

* рендер в картинку   
* выгрузка модели квартиры .glb

modules/**Apartments** создается точкой входа Remplanner3D  
создает коробку квартиры

* создает экземпляры modules/Walls, modules/Ceiling, modules/Portal, modules/Interior, modules/Floor, modules/PlinthsFloor, modules/PlinthsCeiling

**modules** которые создаются в modules/**Apartments**

modules/**Wall** создается в modules/Apartments

* хранит данные о стенах   
* создает экземпляры следующих классов

  modules/Wall/**WallNiches**  
* создает Ниши   
* хранит данные о нишах

	modules/Wall/**WallMoldings**

* создает Молдинги   
* хранит данные о молдингах

	

* пользуется следующими методами

	  
modules/Wall/**WallFaces**

* создает, добавляет стены 

	modules/Wall/**WallCaps**

* создает, добавляет верх стен  

	modules/Wall/Generators/**WallGlass**

* создает, добавляет стеклянные стены


  modules/Wall/**WallGeometry**

  Набор вспомогательных методов создания геометрии для всех классов стен 

modules/**Portal** создается в modules/Apartments  
Создает внутренние откосы, окна, двери   

* пользуется методами modules/Wall/WallFaces, modules/Wall/WallGeometries  
* добавляет в сцену пустые проемы, двери и окна

	modules/Portal/**PortalFrame**  
	хранит данные о порталах  
набор статических методов создания данных для Окон и Дверей

	modules/Portal/**PortalSlopes**  
	набор статических методов создания откосов	

modules/**Ceiling** создается в modules/Apartments

* создает потолки  
* хранит данные о потолках

**modules** статические, нигде не создаются работают без контекста  

modules/**Model** создатель мешей  
.load() запрашивает в Registry данные материала, подгружает меш, добавляет в сцену 

**systems** живут изолированно, общаются через медиатор, создаются из remplanner-cfg в Engine

systems/**UserInterface** инитится через remplanner-cfg кнопочная обвязка

* создает боковые панели systems/UserInterface/panels  
* создает миникарту   
* ….  
* через systems/UserInterface/interfaceActions сигналит медиатору о событиях UI

systems/**Debug** инитится через remplanner-cfg  
методы и ui дебага

systems/**Walker** инитится через remplanner-cfg

* активирует через медиатор Engine/systems/NavigatorFPerson  
* хранит данные о порталах коллизиях в квартире

systems/**Selector** инитится через remplanner-cfg

* хранит текущий фокус на элементе   
* выбирает элемент если в его меше свойства userData.fixed \= false

systems/**BareRoom** инитится через remplanner-cfg

* обрезает квартиру по высоте в режиме просмотра 1м 

**ОПИСАНИЕ Engine.** 

**Engine** описание\_выше 

**Engine/systems** экземпляры живут изолированно, общение-медиатор, создаются из remplanner-cfg в Engine

Engine/systems/**NavigatorFPerson**  инитится через remplanner-cfg

* слушает вводы пользователя  
* двигает камеру

Engine/systems/**Graphics**  инитится через remplanner-cfg

* подключает всю графику к медиатору 

**Engine/systems/Graphics**  статическое хранилище данных

Engine/systems/Graphics/**SharedData**  
Статически хранит все меши в открытом доступе 

**Engine/systems/Graphics** статический набор методов без контекста

Engine/systems/Graphics/**Mesh** методы медиатора через Engine/systems/Graphics  
Статический метод создания меша   
options.userData.fixed \= true меш не чекается селектором  
options.userData.rayObstruct \= true сквозь меш нельзя выбрать предмет   
options.userData.entity.roomId \= ‘room\_id\_mesh\_in’ скрывает меш при покомнатном просмотре не принадлежащий текущей комнате  
options.name \= ‘mesh\_unique\_name’ служит для применения сохраненного пользователем материала при перезагрузке   
options.material.saveKey \= \[‘mesh\_unique\_name’, ‘mesh\_unique\_name\_2’\] применяет при перезагрузке материалы к мешам по имени  
options.material.presetId \= ‘1262’ значение это ключ из хранилища Registry.\#materials  
options.material.group \= ‘group\_unique\_name’ меняет материал у всех чилдренов      
THREE.Group.name \= ‘group\_name’ 

.create(options)  

* по данным создает геометрию в Graphics/Geometries,   
* по данным создает материал в Graphics/Materials,   
* создает меш,   
* добавляет меш в сцену через Graphics/Entities  
* регистрирует в Graphics/SharedData    
    
  Engine/systems/Graphics/**SceneBasics** методы медиатора через Engine/systems/Graphics  
  Набор методов для создания и добавления в сцену вспомогательных объектов  
  (Groups, Helpers, Lights..)   
    
  Engine/systems/Graphics/**Entities** методы медиатора через Engine/systems/Graphics  
  Набор методов для трансформации мешей, замены их геометрии и материалов, добавления к родителю. Каждый метод получает данные, берет меш из Graphics/SharedData и изменяет его.  
    
  Engine/systems/Graphics/**Geometries** методы медиатора через Engine/systems/Graphics  
  Набор методов для создания и модификации геометрии  
    
  Engine/systems/Graphics/**Materials** методы медиатора через Engine/systems/Graphics  
  Набор методов для создания и модификации материалов

	Engine/systems/Graphics/**Raycast** методы медиатора через Engine/systems/Graphics  
Набор методов для выбора 3д модели под мышью

**ОПИСАНИЕ systems/UserInterface.**

systems/**UserInterface** описание выше

systems/UserInterface/**Elements**  
Набор методов для модификации html, общие для всего UserInterface

## БУКВЕННЫЕ СОКРАЩЕНИЯ СОБЫТИЙ МЕДИАТОРА

| Сокращение | Значение |
|------------|----------|
| `gr` | Graphics |
| `grEnt` | Graphics/Entities |
| `plcDecor` | Decor/Placement |
| `regGet` | Запрос к Registry |
| `prj` | Действие Project |
| `prjGet` | Запрос к Project |
| `dbgControl` | systems/Debug (пока не используется) |
| `sel` | systems/Selector |





















TODO: 
V -camera clip geometry
V -clip top profiles buildings
V -cap short walls
V -cap pilasters top\bottom
V -cap bottom windows left\right 
V -house00 if 4 or less walls top poias not cap one angle
V -door left/rigth parts intercepts with bottom profile
V -back side of roof 
V -back windows
V -make first floor 
V -refactoring depth of whalls
V -if ond of angles less 30 drop house
V -cap inner angles
V -design light
V -texture roofs
V -roads connect left\right sides
V -skip small and short doors
V -add texture sky 
V -window inner dark
V -bug fill poligons roads
V -inner offsets walls angle scrop
V -make wallsData logic before fill poligins 
V -colonnades without walls
V -disable short walls
V -fill stones under colonnades
V -make desert more
V -add collisions
V -collisions colomns sides
V -small level for phones
-add game info 
-black inner houses
-connect verticies by indicies ?


NODE v20.11.0

About
------------   
3d Adventure.  
  
  
![pic](https://raw.githubusercontent.com/fire888/240612_labirint_ch8/refs/heads/master/templates/start-img.webp)

Play
------------ 
[Let's play](https://js.otrisovano.ru/android/chapter08/)
