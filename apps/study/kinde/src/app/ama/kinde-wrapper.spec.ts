import createKindeClient, { KindeUser } from "@kinde-oss/kinde-auth-pkce-js";
import { KindeWrapper } from "./kinde-wrapper";
import { KindeCallback } from "./kinde.model";

const mockGetToken = jest.fn(() => Promise.resolve());
const mockGetIdToken = jest.fn(() => Promise.resolve());
const mockIsAuthenticated = jest.fn(() => Promise.resolve());
const mockGetUser = jest.fn(() => undefined);
const mockGetUserProfile = jest.fn(() => Promise.resolve());
const mockLogin = jest.fn(() => Promise.resolve());
const mockLogout = jest.fn(() => Promise.resolve());
const mockRegister = jest.fn(() => Promise.resolve());
const mockCreateOrg = jest.fn(() => Promise.resolve());
const mockGetClaim = jest.fn(() => Promise.resolve());
const mockGetFlag = jest.fn(() => undefined);
const mockGetBooleanFlag = jest.fn(() => false);
const mockGetStringFlag = jest.fn(() => "");
const mockGetIntegerFlag = jest.fn(() => 0);
const mockGetPermissions = jest.fn(() => undefined);
const mockGetPermission = jest.fn(() => undefined);
const mockGetOrganization = jest.fn(() => undefined);
const mockGetUserOrganizations = jest.fn(() => undefined);

jest.mock("@kinde-oss/kinde-auth-pkce-js", () => {
  const originalModule = jest.requireActual("@kinde-oss/kinde-auth-pkce-js");
  return {
    __esModule: true,
    ...originalModule,
    // The default is createKindeClient
    default: jest.fn(() =>
      Promise.resolve({
        getToken: mockGetToken,
        getIdToken: mockGetIdToken,
        isAuthenticated: mockIsAuthenticated,
        getUser: mockGetUser,
        getUserProfile: mockGetUserProfile,
        login: mockLogin,
        logout: mockLogout,
        register: mockRegister,
        createOrg: mockCreateOrg,
        getClaim: mockGetClaim,
        getFlag: mockGetFlag,
        getBooleanFlag: mockGetBooleanFlag,
        getStringFlag: mockGetStringFlag,
        getIntegerFlag: mockGetIntegerFlag,
        getPermissions: mockGetPermissions,
        getPermission: mockGetPermission,
        getOrganization: mockGetOrganization,
        getUserOrganizations: mockGetUserOrganizations,
      })
    ),
  };
});

describe(`Given ${KindeWrapper.name}`, () => {
  describe(`When building`, () => {
    let instance: KindeWrapper;

    interface TestingWrapper {
      name: string;
      mock: jest.Mock;
    }

    const TESTINGS: TestingWrapper[] = [
      { name: "getToken", mock: mockGetToken },
      { name: "getIdToken", mock: mockGetIdToken },
      { name: "isAuthenticated", mock: mockIsAuthenticated },
      { name: "getUser", mock: mockGetUser },
      { name: "getUserProfile", mock: mockGetUserProfile },
      { name: "login", mock: mockLogin },
      { name: "logout", mock: mockLogout },
      { name: "register", mock: mockRegister },
      { name: "createOrg", mock: mockCreateOrg },
      { name: "getClaim", mock: mockGetClaim },
      { name: "getFlag", mock: mockGetFlag },
      { name: "getBooleanFlag", mock: mockGetBooleanFlag },
      { name: "getStringFlag", mock: mockGetStringFlag },
      { name: "getIntegerFlag", mock: mockGetIntegerFlag },
      { name: "getPermissions", mock: mockGetPermissions },
      { name: "getPermission", mock: mockGetPermission },
      { name: "getOrganization", mock: mockGetOrganization },
      { name: "getUserOrganizations", mock: mockGetUserOrganizations },
    ];

    describe(`Without configuration`, () => {
      beforeEach(() => {
        instance = new KindeWrapper();
      });
      test("Then should be a good instance", () => {
        expect(instance).toBeInstanceOf(KindeWrapper);
      });
      test("Then should not be any configuration", () => {
        expect(instance.configuration).toBeUndefined();
      });
      test("Then should not be initialized", (done) => {
        expect(instance.initialized).toEqual(false);
        expect(createKindeClient).not.toHaveBeenCalled();
        instance.initialized$.subscribe((value) => {
          expect(value).toEqual(false);
          done();
        });
      });
      describe(`When using directly`, () => {
        TESTINGS.forEach((testing) => {
          describe(`${KindeWrapper.name}.${testing.name}()`, () => {
            beforeEach(() => {
              testing.mock.mockClear();
            });
            test(`Then should be an error`, () => {
              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              expect(() => (instance as any)[testing.name]()).toThrow(
                "The client is missing"
              );
              expect(testing.mock).not.toHaveBeenCalled();
            });
          });
        });
      });
      describe(`When set a configuration`, () => {
        const MY_REDIRECT_CALLBACK: KindeCallback = (
          user: KindeUser,
          appState?: object
        ) => {
          if (user) {
            return 1;
          }
          if (appState) {
            return 2;
          }
          return 0;
        };
        beforeEach(() => {
          instance.configuration = {
            audience: "myAudience",
            domain: "my.domain.kinde.com",
            clientId: "myTestClientId",
            redirectUri: "myRedirectUri",
            logoutUri: "myLogoutUri",
            scope: "myScopes",
            useLocalStorage: true,
            onRedirectCallback: MY_REDIRECT_CALLBACK,
          };
        });
        test("Then should have a configuration", () => {
          expect(instance.configuration).toBeDefined();
        });
        test("Then should be initialized", (done) => {
          expect(instance.initialized).toEqual(true);
          instance.initialized$.subscribe((value) => {
            expect(value).toEqual(true);
            done();
          });
        });
        test("Then should be initialized with", () => {
          expect(createKindeClient).toHaveBeenLastCalledWith({
            audience: "myAudience",
            client_id: "myTestClientId",
            domain: "my.domain.kinde.com",
            is_dangerously_use_local_storage: true,
            logout_uri: "myLogoutUri",
            redirect_uri: "myRedirectUri",
            on_redirect_callback: MY_REDIRECT_CALLBACK,
            scope: "myScopes",
          });
        });
        describe(`When using basically`, () => {
          TESTINGS.forEach((testing) => {
            describe(`${KindeWrapper.name}.${testing.name}()`, () => {
              beforeEach(() => {
                testing.mock.mockClear();
              });
              test(`Then should be no errors`, () => {
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                expect(() => (instance as any)[testing.name]()).not.toThrow();
                expect(testing.mock).toHaveBeenCalled();
              });
            });
          });
        });
      });
    });
    describe(`With configuration`, () => {
      beforeEach(() => {
        instance = new KindeWrapper({
          domain: "domain.kinde.com",
          clientId: "myTestClientId",
          redirectUri: "http://localhost",
        });
      });
      test("Then should have a configuration", () => {
        expect(instance.configuration).toBeDefined();
      });
      test("Then should be initialized", (done) => {
        expect(instance.initialized).toEqual(true);
        instance.initialized$.subscribe((value) => {
          expect(value).toEqual(true);
          done();
        });
      });
      test("Then should be initialized with", () => {
        expect(createKindeClient).toHaveBeenLastCalledWith({
          audience: undefined,
          client_id: "myTestClientId",
          domain: "domain.kinde.com",
          is_dangerously_use_local_storage: undefined,
          logout_uri: undefined,
          redirect_uri: "http://localhost",
          on_redirect_callback: undefined,
          scope: undefined,
        });
      });
      describe(`When using basically`, () => {
        TESTINGS.forEach((testing) => {
          describe(`${KindeWrapper.name}.${testing.name}()`, () => {
            beforeEach(() => {
              testing.mock.mockClear();
            });
            test(`Then should be no errors`, () => {
              /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
              expect(() => (instance as any)[testing.name]()).not.toThrow();
              expect(testing.mock).toHaveBeenCalled();
            });
          });
        });
      });
      describe(`When using with params`, () => {
        describe(`${KindeWrapper.name}.login(...)`, () => {
          test("Then should be correctly called", () => {
            instance.login();
            expect(mockLogin).toHaveBeenLastCalledWith(undefined);
            instance.login({ org_code: "myOrgCode" });
            expect(mockLogin).toHaveBeenLastCalledWith({
              org_code: "myOrgCode",
            });
          });
        });
        describe(`${KindeWrapper.name}.register(...)`, () => {
          test("Then should be correctly called", () => {
            instance.register();
            expect(mockRegister).toHaveBeenLastCalledWith(undefined);
            instance.register({
              org_code: "myOrgCode",
              app_state: { redirectTo: "url" },
            });
            expect(mockRegister).toHaveBeenLastCalledWith({
              org_code: "myOrgCode",
              app_state: { redirectTo: "url" },
            });
          });
        });
        describe(`${KindeWrapper.name}.createOrg(...)`, () => {
          test("Then should be correctly called", () => {
            instance.createOrg();
            expect(mockCreateOrg).toHaveBeenLastCalledWith(undefined);
            instance.createOrg({
              org_name: "myOrgName",
              app_state: { redirectTo: "url" },
            });
            expect(mockCreateOrg).toHaveBeenLastCalledWith({
              org_name: "myOrgName",
              app_state: { redirectTo: "url" },
            });
          });
        });
        describe(`${KindeWrapper.name}.getClaim(...)`, () => {
          test("Then should be correctly called", () => {
            instance.getClaim("myClaim");
            expect(mockGetClaim).toHaveBeenLastCalledWith("myClaim", undefined);
            instance.getClaim("myNameClaim", "id_token");
            expect(mockGetClaim).toHaveBeenLastCalledWith(
              "myNameClaim",
              "id_token"
            );
          });
        });
      });
    });
  });
});
